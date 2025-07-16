import type { SetableCriteria, Format, FormatTypes } from '../formats';
import { Issue } from '../../utils';

export class FormatsManager {
    private store = new Map<string, Format<SetableCriteria>>();

    constructor() {}

    add(formats: Format[]) {
        for (const format of formats) {
            this.store.set(format.type, format);
        }
    }

    has(type: string): boolean {
        return (!!this.store.has(type));
    }

    get(type: FormatTypes): Format {
        const format = this.store.get(type);
        if (!format) throw new Issue(
            "FORMATS MANAGER",
            "This type is not recognized: " + type
        );

        return (format);
    }
}
