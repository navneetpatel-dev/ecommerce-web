interface Role {
  id: string;
  name: string;
}

interface RoleOptionsListProps {
  roles?: Role[];
  currentRoleName: string;
}

export function RoleOptionsList({
  roles,
  currentRoleName,
}: RoleOptionsListProps) {
  if (!roles || roles.length === 0) return null;

  return (
    <>
      {roles.map((role) => (
        <option key={role.id} value={role.id}>
          {role.name} {role.name === currentRoleName ? "(Current)" : ""}
        </option>
      ))}
    </>
  );
}
