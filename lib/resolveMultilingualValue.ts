import z from "zod";

const ResolveSchema = z.object({
    value: z.any(),
    currentLanguage: z.string()
})

type ResolveSchemaType = z.infer<typeof ResolveSchema>

export const resolveMultilingualValue = ({ value, currentLanguage }: ResolveSchemaType): string => {
    const parsedValue = ResolveSchema.parse({ value, currentLanguage })
    
    if (!parsedValue.value) return '';
    if (typeof parsedValue.value === 'string') return parsedValue.value;
    if (typeof parsedValue.value === 'object') {
        return parsedValue.value[parsedValue.currentLanguage] || parsedValue.value['fr'] || parsedValue.value['en'] || Object.values(parsedValue.value)[0] || '';
    }
    return '';
};