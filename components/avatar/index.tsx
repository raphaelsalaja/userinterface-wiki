import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { clsx } from "clsx";
import { getColorHash } from "@/lib/utils/colors";
import styles from "./styles.module.css";

interface AvatarRootProps
  extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Root> {}
function AvatarRoot({ className, ...props }: AvatarRootProps) {
  return (
    <BaseAvatar.Root className={clsx(styles.avatar, className)} {...props} />
  );
}

interface AvatarImageProps
  extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Image> {}
function AvatarImage({ ...props }: AvatarImageProps) {
  return <BaseAvatar.Image className={styles.photo} {...props} />;
}

interface AvatarFallbackProps
  extends React.ComponentPropsWithoutRef<typeof BaseAvatar.Fallback> {
  initials: string;
}
function AvatarFallback({ initials, ...props }: AvatarFallbackProps) {
  return (
    <BaseAvatar.Fallback
      style={{ backgroundColor: getColorHash(initials) }}
      className={`${styles.fallback}`}
      {...props}
    >
      {initials}
    </BaseAvatar.Fallback>
  );
}

export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
