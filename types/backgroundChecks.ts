export const BACKGROUND_CHECK_STATUSES = {
    NOT_VERIFIED: 'not_verified',
    PENDING: 'pending',
    VERIFIED: 'verified',
    REJECTED: 'rejected',
} as const;

export type BackgroundCheckStatus = (typeof BACKGROUND_CHECK_STATUSES)[keyof typeof BACKGROUND_CHECK_STATUSES];

export const DOCUMENT_TYPE_LABELS = {
    license: 'Australian Driver License',
    passport: 'Passport',
    medicare: 'Medicare Card',
    student_id: 'Student ID',
} as const;

export type DocumentType = keyof typeof DOCUMENT_TYPE_LABELS | 'none';