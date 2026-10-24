import type { AppRole } from '@bd-course/shared';
import { createSupabaseServerClient, isSupabaseConfigured } from '../supabase/server';

export interface AuthenticatedActor {
  id: string;
  email: string;
  fullName: string;
  roles: AppRole[];
  isDevelopmentFallback: boolean;
}

/**
 * Server-side Role-Based Access Control (RBAC) verifier.
 * Always verifies roles against the database (`user_roles` table) when Supabase is connected.
 * Hiding frontend buttons is never treated as sufficient authorization.
 */
export async function getAuthenticatedActor(): Promise<AuthenticatedActor | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  const { data: roleRows } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  const roles: AppRole[] = (roleRows ?? []).map((r) => r.role as AppRole);
  if (roles.length === 0) {
    roles.push('student');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, is_suspended')
    .eq('id', user.id)
    .single();

  if (profile?.is_suspended) {
    throw new Error('ACCOUNT_SUSPENDED: Your account has been suspended by an administrator.');
  }

  return {
    id: user.id,
    email: user.email ?? '',
    fullName: profile?.full_name ?? user.email ?? 'User',
    roles,
    isDevelopmentFallback: false,
  };
}

export async function requireServerRole(requiredRoles: AppRole[]): Promise<AuthenticatedActor> {
  const actor = await getAuthenticatedActor();
  if (!actor) {
    throw new Error('UNAUTHENTICATED: Please sign in to access this resource.');
  }
  const authorized = requiredRoles.some((role) => actor.roles.includes(role));
  if (!authorized) {
    throw new Error(
      `FORBIDDEN: Requires one of [${requiredRoles.join(', ')}], current roles: [${actor.roles.join(', ')}]`
    );
  }
  return actor;
}
