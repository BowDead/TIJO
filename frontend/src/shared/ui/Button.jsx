import styles from "./Button.module.scss";

export function Button({
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}) {
  const classes = [
    styles.button,
    styles[variant],
    size === "sm" && styles.small,
  ]
    .filter(Boolean)
    .join(" ");

  return <button type={type} className={classes} {...props} />;
}
