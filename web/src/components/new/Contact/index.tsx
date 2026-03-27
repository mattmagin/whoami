import { useState, useRef } from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import confetti from "canvas-confetti";
import { Send, Mail, Github, Linkedin, MapPin, CheckCircle } from "lucide-react";
import { Text, Button } from "@/components/ui";
import ShadowBox from "@/components/new/ShadowBox";
import { Theme } from "@/components/new/theme";
import { SectionContainer } from "@/components/new/layout";
import { useCreateContact, useResume } from "@/hooks";
import {
  CONTACT_LIMITS,
  contactSchema,
  type ContactFormValues,
} from "@/consts";

const ACCENT = Theme.colors.dark.pink;

const pulse = keyframes`
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
`;

const Section = styled.section`
  width: 100%;
  background-color: ${Theme.colors.dark.contentBackground};
  padding: 80px 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const TwoCol = styled.div`
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 40px;
  align-items: start;
`;

/* ── Form ── */

const FormBox = styled.div`
  padding: 32px;
`;

const FormFields = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const StyledLabel = styled.label`
  font-weight: 700;
  font-size: 0.85rem;
  color: ${Theme.colors.dark.heading};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  font-family: inherit;
  border: 3px solid
    ${(p) => (p.$hasError ? "#e53e3e" : Theme.colors.dark.borderOutline)};
  background-color: #ffffff;
  color: ${Theme.colors.dark.heading};
  outline: none;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${ACCENT};
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  width: 100%;
  padding: 12px 14px;
  font-size: 1rem;
  font-family: inherit;
  border: 3px solid
    ${(p) => (p.$hasError ? "#e53e3e" : Theme.colors.dark.borderOutline)};
  background-color: #ffffff;
  color: ${Theme.colors.dark.heading};
  outline: none;
  resize: none;
  min-height: 150px;
  transition: border-color 0.15s ease;

  &:focus {
    border-color: ${ACCENT};
  }

  &::placeholder {
    color: #9e9e9e;
  }
`;

const FieldError = styled.span`
  font-size: 0.8rem;
  font-weight: 600;
  color: #e53e3e;
`;

const ServerError = styled.div`
  padding: 12px 16px;
  background-color: #fed7d7;
  border: 3px solid #e53e3e;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CharCount = styled.span<{ $near?: boolean; $over?: boolean }>`
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
  color: ${(p) =>
    p.$over ? "#e53e3e" : p.$near ? Theme.colors.dark.body : "transparent"};
  text-align: right;
`;

/* ── Contact info sidebar ── */

const InfoBox = styled.div`
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const LinkRow = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  color: ${Theme.colors.dark.heading};
  text-decoration: none;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.15s ease;

  &:hover {
    color: ${ACCENT};
  }
`;

const IconCircle = styled.div<{ $bg: string }>`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(p) => p.$bg};
  border: 3px solid ${Theme.colors.dark.borderOutline};
`;

/* ── Success ── */

const SuccessBox = styled.div`
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
`;

/* ── Skeleton ── */

const SkeletonBlock = styled.div<{ $w?: string; $h?: string }>`
  width: ${(p) => p.$w ?? "100%"};
  height: ${(p) => p.$h ?? "18px"};
  background-color: #e0dbd7;
  border-radius: 4px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

const LoadingSkeleton = () => (
  <Content>
    <SkeletonBlock $w="200px" $h="32px" />
    <TwoCol>
      <SkeletonBlock $h="380px" />
      <SkeletonBlock $h="260px" />
    </TwoCol>
  </Content>
);

const Contact: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { mutate, isPending: isSubmitting } = useCreateContact();
  const { data: resume, isLoading: resumeLoading } = useResume();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", message: "" },
  });

  const triggerConfetti = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x, y },
      colors: [ACCENT, Theme.colors.dark.purple, Theme.colors.dark.blue, "#ffffff"],
      ticks: 150,
      gravity: 1.2,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  };

  const messageValue = watch("message");
  const messageLength = messageValue.trim().length;
  const messageNear = messageLength > CONTACT_LIMITS.message * 0.9;
  const messageOver = messageLength > CONTACT_LIMITS.message;

  const onSubmit = (data: ContactFormValues) => {
    setServerError(null);
    mutate(data, {
      onSuccess: () => {
        setSubmitted(true);
        triggerConfetti();
      },
      onError: () => {
        setServerError("Something went wrong. Please try again.");
      },
    });
  };

  const contact = resume?.contact;

  return (
    <Section id="contact">
      <SectionContainer>
        {resumeLoading ? (
          <LoadingSkeleton />
        ) : (
          <Content>
            <Text variant="sectionTitle" style={{ color: ACCENT }}>
              Get in Touch
            </Text>

            <TwoCol>
              {/* ── Form column ── */}
              <ShadowBox offset="sm">
                <FormBox>
                  {submitted ? (
                    <SuccessBox>
                      <CheckCircle size={48} color={Theme.colors.dark.green} />
                      <Text variant="cardTitle">Message Sent!</Text>
                      <Text variant="body">
                        Thanks for reaching out. I&apos;ll get back to you soon.
                      </Text>
                      <Button
                        variant="ghost"
                        onClick={() => setSubmitted(false)}
                      >
                        Send Another Message
                      </Button>
                    </SuccessBox>
                  ) : (
                    <FormFields onSubmit={handleSubmit(onSubmit)} noValidate>
                      <FieldRow>
                        <FieldGroup>
                          <StyledLabel htmlFor="contact-name">
                            Name
                          </StyledLabel>
                          <StyledInput
                            id="contact-name"
                            placeholder="Your name"
                            maxLength={CONTACT_LIMITS.name}
                            disabled={isSubmitting}
                            $hasError={!!errors.name}
                            {...register("name")}
                          />
                          {errors.name && (
                            <FieldError>{errors.name.message}</FieldError>
                          )}
                        </FieldGroup>
                        <FieldGroup>
                          <StyledLabel htmlFor="contact-email">
                            Email
                          </StyledLabel>
                          <StyledInput
                            id="contact-email"
                            type="email"
                            placeholder="you@example.com"
                            maxLength={CONTACT_LIMITS.email}
                            disabled={isSubmitting}
                            $hasError={!!errors.email}
                            {...register("email")}
                          />
                          {errors.email && (
                            <FieldError>{errors.email.message}</FieldError>
                          )}
                        </FieldGroup>
                      </FieldRow>

                      <FieldGroup>
                        <StyledLabel htmlFor="contact-message">
                          Message
                        </StyledLabel>
                        <StyledTextarea
                          id="contact-message"
                          placeholder="What would you like to discuss?"
                          rows={6}
                          disabled={isSubmitting}
                          $hasError={!!errors.message}
                          {...register("message")}
                        />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          {errors.message ? (
                            <FieldError>{errors.message.message}</FieldError>
                          ) : (
                            <span />
                          )}
                          <CharCount $near={messageNear} $over={messageOver}>
                            {messageLength.toLocaleString()}/
                            {CONTACT_LIMITS.message.toLocaleString()}
                          </CharCount>
                        </div>
                      </FieldGroup>

                      {serverError && (
                        <ServerError>
                          <Text
                            variant="bodySmall"
                            style={{ color: "#e53e3e", fontWeight: 600 }}
                          >
                            {serverError}
                          </Text>
                        </ServerError>
                      )}

                      <Button
                        ref={buttonRef}
                        type="submit"
                        color="pink"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Sending..." : "Send Message"}
                        {!isSubmitting && <Send size={16} />}
                      </Button>
                    </FormFields>
                  )}
                </FormBox>
              </ShadowBox>

              {/* ── Contact info column ── */}
              <ShadowBox offset="sm" backgroundColor={ACCENT}>
                <InfoBox>
                  <Text
                    variant="cardTitle"
                    style={{ color: Theme.colors.dark.heading }}
                  >
                    Contact Info
                  </Text>

                  {contact?.email && (
                    <LinkRow href={`mailto:${contact.email}`}>
                      <IconCircle $bg="#ffffff">
                        <Mail size={18} />
                      </IconCircle>
                      {contact.email}
                    </LinkRow>
                  )}

                  {contact?.github && (
                    <LinkRow
                      href={contact.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconCircle $bg="#ffffff">
                        <Github size={18} />
                      </IconCircle>
                      GitHub
                    </LinkRow>
                  )}

                  {contact?.linkedin && (
                    <LinkRow
                      href={contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <IconCircle $bg="#ffffff">
                        <Linkedin size={18} />
                      </IconCircle>
                      LinkedIn
                    </LinkRow>
                  )}

                  {contact?.location && (
                    <LinkRow as="div">
                      <IconCircle $bg="#ffffff">
                        <MapPin size={18} />
                      </IconCircle>
                      {contact.location}
                    </LinkRow>
                  )}
                </InfoBox>
              </ShadowBox>
            </TwoCol>
          </Content>
        )}
      </SectionContainer>
    </Section>
  );
};

export default Contact;
