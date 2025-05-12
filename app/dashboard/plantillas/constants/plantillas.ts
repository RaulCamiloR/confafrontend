
interface TemplateConstants {
    templateTypes: string[]
}

export const templateConstants: TemplateConstants = {
    templateTypes: ['EMAIL', 'SMS']
}

export type TemplateType = 'EMAIL' | 'SMS';