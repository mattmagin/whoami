import type { ResumeExperience } from "@/api";

/**
 * Static professional experience for the resume page (source of truth until CMS/API owns it again).
 */
export const STATIC_RESUME_EXPERIENCE = [
  {
    title: "Software Engineer (Mid Level)",
    company: "Smartsheet",
    location: "Remote",
    dates: "Sep 2022 – Feb 2026",
    highlights: [
      "Led technical design and frontend architecture for the agentic AI automated workflows widget within the high-value flagship SmartAssist copilot experience, enabling an IFTTT-like interface to handle complex data-rich workflows.",
      "Designed and implemented the solution using React and TypeScript to deploy a Single-SPA microfrontend, enabling independent deployment and integration across both the chat agent and as a replacement for the existing workflows UI.",
      "Used Bedrock LLMs to suggest and populate workflows based on the context and intent of natural language prompts by customers, significantly reducing the complexity of building advanced automations within Smartsheet.",
      "Produced technical demo videos and engineering documentation to align global product, design, and engineering stakeholders across US and UK teams on the progress of the SmartAssist integration efforts.",
      "Integrated Outfit's drag-and-drop canvas template builder into Smartsheet's core Document Builder product, enabling enterprise customers to design templates and mass-generate documents (often hundreds or thousands) using existing sheet data.",
      "Delivered a significantly improved onboarding and template creation experience, projected to increase product adoption by approximately 5% through improved usability, discoverability, and workflow efficiency.",
      "Built CI/CD pipelines in GitLab to automate testing and development workflows.",
      "Managed multi-region AWS infrastructure via Terragrunt and Terraform to support independent microservice deployment and compliance with regional data residency requirements.",
      "Engineered compliance-critical platform features for 10,000+ enterprise customers operating under stringent data security standards including NIST, FIPS, and HIPAA.",
    ],
  },
  {
    title: "Software Engineer (Junior)",
    company: "Outfit (acquired by Smartsheet)",
    location: "Hybrid Brisbane",
    dates: "Sep 2021 – Sep 2022",
    highlights: [
      "Built a high-performance drag-and-drop canvas editor using Konva.js, transitioning customers to a self-service model for on-brand marketing collateral templates and significantly reducing their time-to-value.",
      "Delivered advanced editor capabilities including rich text logic, auto text-fitting, multi-page PDF support, and image cropping to improve template flexibility and usability.",
      "Engineered a canvas-to-PDF and PNG export pipeline ensuring 1:1 brand fidelity and high-quality document output across generated marketing assets.",
      "Developed internal DevX tooling that improved template development velocity and asset export reliability for the professional services team.",
    ],
  },
  {
    title: "Frontend Developer & Squad Leader",
    company: "Outfit",
    location: "Onsite Brisbane",
    dates: "Jan 2019 – Sep 2021",
    highlights: [
      "Built hundreds of dynamic, automated marketing templates for major brands using HTML, CSS, and JavaScript, delivering high-quality assets under strict client deadlines while ensuring templates followed established brand guidelines.",
      "Developed new template functionality including automatic font scaling and dynamic content based on user or team metadata.",
      "Successfully led and mentored a squad of two developers while balancing customer delivery in a fast-paced professional services environment.",
    ],
  },
] as const satisfies readonly ResumeExperience[];
