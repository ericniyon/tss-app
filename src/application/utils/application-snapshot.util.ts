import { Application } from '../entities/application.entity';
import { Answer } from '../entities/answer.entity';

type SnapshotSection = {
    id: number;
    title: string;
    tips: string;
    subcategoryId?: number;
    sectionCategory?: number;
    answers: SnapshotAnswer[];
};

export type SnapshotAnswer = {
    id: number;
    responses: string[];
    attachments: string[];
    status: string;
    feedback?: string;
    question?: {
        id: number;
        text: string;
        type: string;
        requiresAttachments: boolean;
        possibleAnswers: string[];
        section?: {
            id: number;
            title: string;
            tips: string;
            subcategoryId?: number;
            sectionCategory?: number;
        };
    };
};

export type ApplicationSnapshotPayload = {
    id: number;
    companyUrl: string;
    status: string;
    submittedAt?: Date;
    completed: boolean;
    setupFee?: number;
    subscriptionFee?: number;
    businessPlatform?: string;
    category?: { id: number; name: string };
    applicant?: { id: number; name: string; email: string; phone?: string };
    assignees: { id: number; name: string; email: string }[];
    sections: SnapshotSection[];
};

const sanitizeAnswer = (answer: Answer): SnapshotAnswer => ({
    id: answer.id,
    responses: answer.responses || [],
    attachments: answer.attachments || [],
    status: answer.status,
    feedback: answer.feedback,
    question: answer.question
        ? {
              id: answer.question.id,
              text: answer.question.text,
              type: answer.question.type,
              requiresAttachments: answer.question.requiresAttachments,
              possibleAnswers: answer.question.possibleAnswers || [],
              section: answer.question.section
                  ? {
                        id: answer.question.section.id,
                        title: answer.question.section.title,
                        tips: answer.question.section.tips,
                        subcategoryId: answer.question.section.subcategoryId,
                        sectionCategory:
                            answer.question.section.sectionCategory,
                    }
                  : undefined,
          }
        : undefined,
});

export const buildApplicationSnapshotPayload = (
    application: Application,
): ApplicationSnapshotPayload => {
    const sanitizedAnswers = (application.answers || []).map((answer) =>
        sanitizeAnswer(answer),
    );

    const sectionsMap = new Map<number, SnapshotSection>();
    sanitizedAnswers.forEach((answer) => {
        const section = answer.question?.section;
        if (!section) return;
        if (!sectionsMap.has(section.id)) {
            sectionsMap.set(section.id, {
                id: section.id,
                title: section.title,
                tips: section.tips,
                subcategoryId: section.subcategoryId,
                sectionCategory: section.sectionCategory,
                answers: [],
            });
        }
        sectionsMap.get(section.id)?.answers.push(answer);
    });

    const sections = Array.from(sectionsMap.values())
        .map((section) => ({
            ...section,
            answers: section.answers.sort(
                (a, b) =>
                    (a.question?.id || Number.MIN_SAFE_INTEGER) -
                    (b.question?.id || Number.MIN_SAFE_INTEGER),
            ),
        }))
        .sort((a, b) => a.id - b.id);

    return {
        id: application.id,
        companyUrl: application.companyUrl,
        status: application.status,
        submittedAt: application.submittedAt,
        completed: application.completed,
        setupFee: application.setupFee,
        subscriptionFee: application.subscriptionFee,
        businessPlatform: application.businessPlatform,
        category: application.category
            ? {
                  id: application.category.id,
                  name: application.category.name,
              }
            : undefined,
        applicant: application.applicant
            ? {
                  id: application.applicant.id,
                  name: application.applicant.name,
                  email: application.applicant.email,
                  phone: application.applicant.phone,
              }
            : undefined,
        assignees: (application.assignees || []).map((assignee) => ({
            id: assignee.id,
            name: assignee.name,
            email: assignee.email,
        })),
        sections,
    };
};

