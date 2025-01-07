type FistArgFunction<T> = T extends (arg: infer U, ...args: any[]) => any ? U : never;
export type StringKindsMap = {
    [K in keyof InstanceType<typeof StringKinds>]: FistArgFunction<InstanceType<typeof StringKinds>[K]>;
};
interface EmailParams {
    identifier?: RegExp;
    subdomain?: RegExp;
    TLD?: RegExp;
}
export declare class StringKinds {
    email(params: EmailParams, value: string): "INVALID_EMAIL" | undefined;
}
export {};
