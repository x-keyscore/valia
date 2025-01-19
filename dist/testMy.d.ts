import { Schema } from "./schema";
export declare const userFormat: Schema<{
    readonly type: "struct";
    readonly struct: {
        readonly credential: import("./formats/types").DefaultVariantCriteria & import("./formats/struct/types").StructDefaultCriteria & {
            readonly type: "struct";
            readonly struct: {
                readonly email: {
                    readonly type: "string";
                    readonly tester: {
                        readonly name: "isEmail";
                    };
                };
                readonly password: {
                    readonly type: "string";
                };
            };
        } & import("./formats/struct/types").StructMountedCriteria & import("./formats/types").DefaultMountedCriteria;
        readonly profile: import("./formats/types").DefaultVariantCriteria & import("./formats/struct/types").StructDefaultCriteria & {
            readonly type: "struct";
            readonly struct: {
                readonly firstName: {
                    readonly type: "string";
                };
                readonly lastName: {
                    readonly type: "string";
                };
                readonly color: {
                    readonly type: "string";
                    readonly regex: RegExp;
                };
                readonly avatar: {
                    readonly type: "string";
                };
                readonly contact: {
                    readonly type: "struct";
                    readonly struct: {
                        readonly email: {
                            readonly type: "string";
                            readonly tester: {
                                readonly name: "isEmail";
                            };
                        };
                        readonly phoneNumber: {
                            readonly type: "string";
                        };
                    };
                };
            };
        } & import("./formats/struct/types").StructMountedCriteria & import("./formats/types").DefaultMountedCriteria;
        readonly setting: import("./formats/types").DefaultVariantCriteria & import("./formats/struct/types").StructDefaultCriteria & {
            readonly type: "struct";
            readonly struct: {
                readonly notification: {
                    readonly type: "boolean";
                };
                readonly theme: {
                    readonly type: "string";
                };
            };
        } & import("./formats/struct/types").StructMountedCriteria & import("./formats/types").DefaultMountedCriteria;
        readonly sessions: {
            readonly type: "array";
            readonly max: 10;
            readonly item: import("./formats/types").DefaultVariantCriteria & import("./formats/struct/types").StructDefaultCriteria & {
                readonly type: "struct";
                readonly struct: {
                    readonly ip: {
                        readonly type: "struct";
                        readonly struct: {
                            readonly internal: {
                                readonly type: "string";
                                readonly tester: {
                                    readonly name: "isIp";
                                    readonly params: {
                                        readonly allowIpV6: false;
                                    };
                                };
                            };
                            readonly external: {
                                readonly type: "string";
                                readonly tester: {
                                    readonly name: "isIp";
                                    readonly params: {
                                        readonly allowIpV6: false;
                                    };
                                };
                            };
                        };
                    };
                    readonly agent: {
                        readonly type: "string";
                    };
                    readonly token: {
                        readonly type: "string";
                    };
                };
            } & import("./formats/struct/types").StructMountedCriteria & import("./formats/types").DefaultMountedCriteria;
        };
        readonly permissions: {
            readonly type: "array";
            readonly empty: true;
            readonly item: {
                readonly type: "string";
            };
        };
    };
}>;
