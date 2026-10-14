export declare const ObserveModule: {
    new (httpAdapterHost: import("@nestjs/core", { with: { "resolution-mode": "import" } }).HttpAdapterHost, asyncLocalStorage: import("async_hooks").AsyncLocalStorage<Map<string, any>>, options: import("@nestjs/observe", { with: { "resolution-mode": "import" } }).ObserveModuleOptionsWithDefaults): {
        readonly logger: import("@nestjs/common", { with: { "resolution-mode": "import" } }).Logger;
        readonly httpAdapterHost: import("@nestjs/core", { with: { "resolution-mode": "import" } }).HttpAdapterHost;
        readonly asyncLocalStorage: import("async_hooks").AsyncLocalStorage<Map<string, any>>;
        readonly options: import("@nestjs/observe", { with: { "resolution-mode": "import" } }).ObserveModuleOptionsWithDefaults;
    };
    forRoot(observeOpts: import("@nestjs/observe", { with: { "resolution-mode": "import" } }).ObserveOptions): import("@nestjs/common", { with: { "resolution-mode": "import" } }).DynamicModule;
    forRootAsync(options: import("@nestjs/observe", { with: { "resolution-mode": "import" } }).ObserveModuleAsyncOptions): import("@nestjs/common", { with: { "resolution-mode": "import" } }).DynamicModule;
    createAsyncProviders(asyncOptions: import("@nestjs/observe", { with: { "resolution-mode": "import" } }).ObserveModuleAsyncOptions): import("@nestjs/common", { with: { "resolution-mode": "import" } }).Provider[];
    createAsyncOptionsProvider(asyncOptions: import("@nestjs/observe", { with: { "resolution-mode": "import" } }).ObserveModuleAsyncOptions): import("@nestjs/common", { with: { "resolution-mode": "import" } }).Provider;
}, ObserveInstrument: {
    instanceDecorator: (instance: unknown) => unknown;
} | undefined;
export declare class AppModule {
}
