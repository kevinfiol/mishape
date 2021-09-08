type ValidationResult = {
    ok: boolean;
    errors: TypeError[]
};

type TypecheckMethod = (...args: any[]) => boolean;

type Validator = (obj: Record<string, any>) => ValidationResult;

type PropertyValidator = (x: any, map?: Record<string, TypecheckMethod>) => boolean;

interface Schema {
    [key: string]: string | Schema | PropertyValidator
}

export default function (schema: Schema, map?: Record<string, TypecheckMethod>): Validator;