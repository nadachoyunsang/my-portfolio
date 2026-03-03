interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  children: React.ReactNode;
}

export default function Container({
  as: Tag = 'div',
  children,
  className = '',
  ...rest
}: ContainerProps) {
  return (
    <Tag className={`mx-auto max-w-5xl px-6 ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
