import type { SetableCriteria, Format } from '../formats';
import { Issue } from '../../utils';

export class FormatsManager {
    formats = new Map<string, Format<SetableCriteria>>();

    constructor() {}

    set(formats: Record<string, Format<SetableCriteria>>) {
        for (const [type, format] of Object.entries(formats)) {
            this.formats.set(type, format);
        }
    }

    get(type: string) {
        const format = this.formats.get(type);
        if (!format) throw new Issue(
            "Checking",
            "The format type '" + type + "' is unknown."
        );

        return (format);
    }
}
