import { Hono } from 'hono';
import { eq, asc, isNull, isNotNull, and } from 'drizzle-orm';
import { db, schema } from '../db';

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** Format a date string (YYYY-MM-DD) into "Mon YYYY" */
const formatDate = (dateStr: string): string => {
  const [year, month] = dateStr.split('-').map(Number);
  return `${MONTH_NAMES[month - 1]} ${year}`;
};

/** Format experience date range from structured columns */
const formatExperienceDates = (startDate: string, endDate: string | null, current: boolean): string => {
  const start = formatDate(startDate);
  if (current || !endDate) return `${start} – Present`;
  return `${start} – ${formatDate(endDate)}`;
};

/** Format education date range from year integers */
const formatEducationDates = (startYear: number | null, endYear: number | null): string => {
  if (startYear && endYear) return `${startYear} – ${endYear}`;
  if (startYear) return `${startYear} – Present`;
  if (endYear) return `${endYear}`;
  return '';
};

const published = <T extends { publishedAt: unknown; deletedAt: unknown }>(table: T) =>
  and(isNotNull(table.publishedAt), isNull(table.deletedAt));

const app = new Hono()
  .get('/', async (c) => {
    const resume = await db.select()
      .from(schema.resumes)
      .where(and(
        eq(schema.resumes.slug, 'primary'),
        isNull(schema.resumes.deletedAt),
        isNotNull(schema.resumes.publishedAt),
      ))
      .then(r => r[0]);

    if (!resume) {
      return c.json({ error: 'not_found', message: 'Resume not found' }, 404);
    }

    const resumeId = resume.id;

    const [skills, experiences, resumeProjects, education, certifications] = await Promise.all([
      db.select()
        .from(schema.resumeSkills)
        .where(and(eq(schema.resumeSkills.resumeId, resumeId), published(schema.resumeSkills)))
        .orderBy(asc(schema.resumeSkills.sortOrder)),

      db.select()
        .from(schema.resumeExperiences)
        .where(and(eq(schema.resumeExperiences.resumeId, resumeId), published(schema.resumeExperiences)))
        .orderBy(asc(schema.resumeExperiences.sortOrder)),

      db.select()
        .from(schema.resumeProjects)
        .where(and(eq(schema.resumeProjects.resumeId, resumeId), published(schema.resumeProjects)))
        .orderBy(asc(schema.resumeProjects.sortOrder)),

      db.select()
        .from(schema.resumeEducation)
        .where(and(eq(schema.resumeEducation.resumeId, resumeId), published(schema.resumeEducation)))
        .orderBy(asc(schema.resumeEducation.sortOrder)),

      db.select()
        .from(schema.resumeCertifications)
        .where(and(eq(schema.resumeCertifications.resumeId, resumeId), published(schema.resumeCertifications)))
        .orderBy(asc(schema.resumeCertifications.sortOrder)),
    ]);

    // Group skills by category into Record<string, string[]>
    const skillsByCategory: Record<string, string[]> = {};
    for (const skill of skills) {
      if (!skillsByCategory[skill.category]) {
        skillsByCategory[skill.category] = [];
      }
      skillsByCategory[skill.category].push(skill.name);
    }

    return c.json({
      name: resume.name,
      title: resume.title,
      contact: {
        email: resume.email,
        location: resume.location,
        github: resume.githubUrl,
        linkedin: resume.linkedinUrl,
      },
      summary: resume.summary,
      skills: skillsByCategory,
      experience: experiences.map((exp) => ({
        title: exp.title,
        company: exp.company,
        location: exp.location,
        dates: formatExperienceDates(exp.startDate, exp.endDate, exp.current),
        highlights: exp.highlights ?? [],
      })),
      projects: resumeProjects.map((proj) => ({
        name: proj.name,
        description: proj.description,
        technologies: proj.technologies ?? [],
      })),
      education: education.map((edu) => ({
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location,
        dates: formatEducationDates(edu.startYear, edu.endYear),
        details: edu.details ?? [],
      })),
      certifications: certifications.map((cert) => ({
        name: cert.name,
        year: cert.year,
      })),
      interests: resume.interests ?? [],
    });
  });

export default app;
