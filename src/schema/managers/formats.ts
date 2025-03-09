import type { SetableCriteria, FormatTemplate } from '../formats';
import { Issue } from '../../utils';

export function formatsManager() {
    return ({
        formats: new Map<string, FormatTemplate<SetableCriteria>>(),
        set(formats: Record<string, FormatTemplate<SetableCriteria>>) {
            for (const [type, format] of Object.entries(formats)) {
                this.formats.set(type, format);
            }
        },
        get(type: string) {
            const format = this.formats.get(type);
            if (!format) throw new Issue(
                "Checking",
                "The format type '" + type + "' is unknown."
            );
    
            return (format);
        }
    });
}
