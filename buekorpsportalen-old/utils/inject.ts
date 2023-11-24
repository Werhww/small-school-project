import type { Role } from "@prisma/client";
import type { InjectionKey } from "vue";

export const roleKey = Symbol() as InjectionKey<{
    role: Ref<Role>
    updateRole: (role: Role) => void
}>