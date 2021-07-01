// At it's simpleest, the access control return a yes or no value depending on the user session

import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';

export function isSignedIn({ session }: ListAccessArgs): boolean {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a criteria - yes or no
export const permissions = {
  ...generatedPermissions,
};

// Rule based functions
//  Rules can return a boolean - yes or no - or filter which limits whcih products they can crud
export const rules = {
  canManageProducts({
    session,
  }: ListAccessArgs): boolean | Record<string, unknown> {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { user: { id: session.itemId } };
  },
  canOrder({ session }: ListAccessArgs): boolean | Record<string, unknown> {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canOrder
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { user: { id: session.itemId } };
  },
  canManageOrderItems({
    session,
  }: ListAccessArgs): boolean | Record<string, unknown> {
    if (!isSignedIn({ session })) {
      return false;
    }
    // 1. Do they have the permission of canOrder
    if (permissions.canManageCart({ session })) {
      return true;
    }
    // 2. If not, do they own this item
    return { order: { user: { id: session.itemId } } };
  },
  canReadProducts({
    session,
  }: ListAccessArgs): boolean | Record<string, unknown> {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageProducts({ session })) {
      return true; // They can read anything
    }
    //   They should only see available products (based on status field)
    return { status: 'AVAILABLE' };
  },
  canManageUsers({
    session,
  }: ListAccessArgs): boolean | Record<string, unknown> {
    if (!isSignedIn({ session })) {
      return false;
    }
    if (permissions.canManageUsers({ session })) {
      return true;
    }
    // Otherwise they may only update themselves
    return { id: session.itemId };
  },
};
