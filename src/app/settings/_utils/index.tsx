import { type Option } from "@/src/components/ui/styled-select";
export const getUserOptions = ({
  currentUser,
  users,
}: {
  users: IUser[] | undefined;
  currentUser: IUser;
}): Option[] => {
  if (!users || users.length === 0) {
    return [
      {
        value: currentUser._id,
        label: `${currentUser.userName} (You)`,
        searchLabel: `${currentUser.userName} ${currentUser.email}`,
      },
    ];
  }

  return users.map((u) => ({
    value: u._id,
    label: (
      <div className="flex items-center gap-2.5 py-1 w-full text-left border-b last:border-b-0">
        <div className="size-6 rounded-full overflow-hidden bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20 text-[10px] font-bold uppercase">
          {u.profileImage?.imageUrl ? (
            <img
              src={u.profileImage.imageUrl}
              alt={u.userName}
              className="size-full object-cover"
            />
          ) : (
            u.userName?.slice(0, 2) || "U"
          )}
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-xs font-semibold truncate text-foreground flex items-center gap-1.5">
            {u.userName}
            {u._id === currentUser._id && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-medium">
                You
              </span>
            )}
            {u.role === "admin" && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 font-medium">
                Admin
              </span>
            )}
          </span>
          <span className="text-[11px] text-muted-foreground truncate">
            {u.email}
          </span>
        </div>
      </div>
    ),
    searchLabel: `${u.userName} ${u.email} ${u._id}`,
  }));
};
