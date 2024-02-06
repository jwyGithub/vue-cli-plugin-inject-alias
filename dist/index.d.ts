import { PluginAPI, ProjectOptions } from '@vue/cli-service';

declare function alias(api: PluginAPI, options: ProjectOptions): void;

export { alias as default };
