import type { SetableCriteria, Format, FormatNames } from '../formats';
import { Issue } from '../../utils';

export class FormatsManager {
    private store = new Map<string, Format<SetableCriteria>>();

    constructor() {}

    add(formats: Format[]) {
        for (const format of formats) {
            this.store.set(format.type, format);
        }
    }

    get(type: FormatNames): Format {
        const format = this.store.get(type);
        if (!format) throw new Issue(
            "Formats Manager",
            "The format of type '" + type + "' is unknown."
        );

        return (format);
    }
}
