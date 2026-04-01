import styled from "@emotion/styled";
import { Text, Button } from "@/components/ui";
import { Badge } from "@/components/Badge";
import ShadowBox from "@/components/ShadowBox";
import { Theme, type Color } from "@/components/theme";
import { useProjects } from "@/hooks";
import type { Project } from "@/api";
import { ExternalLink, Github } from "lucide-react";
import LoadingSkeleton from "./LoadingSkeleton";
import Grid from "../Grid";

const ACCENT = Theme.colors.dark.blue;

const CARD_COLORS: Color[] = ["blue", "green", "orange", "purple", "pink", "yellow"];

const CardContent = styled.div`
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
`;

const CardBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const TechRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const CardFooter = styled.div`
  display: flex;
  gap: 12px;
  margin-top: auto;
  padding-top: 8px;
`;

interface ProjectCardProps {
  project: Project;
  colorKey: Color;
}

const ProjectCard = ({
  project,
  colorKey,
}: {
  project: Project;
  colorKey: Color;
}) => {
  const bg = Theme.colors.dark[colorKey];

  const isLightBg = colorKey === "yellow" || colorKey === "green";
  const textColor = isLightBg
    ? Theme.colors.dark.heading
    : "#ffffff";

  return (
    <ShadowBox offset="sm" backgroundColor={bg}>
      <CardContent>
        <CardBody>
          <Text variant="cardTitle" style={{ color: textColor }}>
            {project.name}
          </Text>
          <Text variant="bodySmall" style={{ color: isLightBg ? Theme.colors.dark.body : "#ffffffcc" }}>
            {project.excerpt || project.description}
          </Text>
          {project.techStack && project.techStack.length > 0 && (
            <TechRow>
              {project.techStack.map((tech) => (
                <Badge
                  key={tech}
                  style={{
                    backgroundColor: isLightBg ? "#00000018" : "#ffffff30",
                    borderColor: isLightBg
                      ? Theme.colors.dark.borderOutline
                      : "#ffffff60",
                    color: textColor,
                    fontSize: "0.7rem",
                  }}
                >
                  {tech}
                </Badge>
              ))}
            </TechRow>
          )}
        </CardBody>
        <CardFooter>
          {project.url && (
            <Button
              variant="ghost"
              size="sm"
              color={colorKey}
              onClick={() => window.open(project.url!, "_blank")}
              style={{ color: textColor }}
            >
              <ExternalLink size={14} />
              Live
            </Button>
          )}
          {project.githubUrl && (
            <Button
              variant="ghost"
              size="sm"
              color={colorKey}
              onClick={() => window.open(project.githubUrl!, "_blank")}
              style={{ color: textColor }}
            >
              <Github size={14} />
              GitHub
            </Button>
          )}
        </CardFooter>
      </CardContent>
    </ShadowBox>
  );
};

const Projects: React.FC = () => {
  const { data, isLoading, isError, refetch } = useProjects(1);

  const projects = data?.data ?? [];
  const projectCardProps: ProjectCardProps[] = projects.map((project, index) => ({ project, colorKey: CARD_COLORS[index % CARD_COLORS.length] }));

  return (
    <>
      {isLoading ? (
        <LoadingSkeleton />
      ) : isError ? (
        <>
          <Text variant="body">Failed to load projects.</Text>
          <Button variant="ghost" onClick={() => refetch()}>Retry</Button>
        </>
      ) : projects.length === 0 ? (
        <>
          <Text variant="body">No projects to show yet.</Text>
        </>
      ) : (
        <>
          <Text variant="sectionTitle" style={{ color: ACCENT }}>
            Projects
          </Text>
          <Grid elements={projectCardProps} Component={ProjectCard} />
        </>
      )}
    </>
  );
};

export default Projects;
