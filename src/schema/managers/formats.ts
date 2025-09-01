import type { Format, FormatTypes } from '../formats';
import { SchemaException } from '../utils';

export class FormatsManager {
    private store = new Map<FormatTypes, Format>();

    constructor() {}

    add(formats: Format[]) {
        for (const format of formats) {
            this.store.set(format.type, format); 
        }
    }

    has(type: FormatTypes) {
        return this.store.has(type);
    }

    get(type: FormatTypes): Format {
        const format = this.store.get(type);
        if (!format) throw new SchemaException(
            "The format is unknown : " + type
        );

        return (format);
    }
}
