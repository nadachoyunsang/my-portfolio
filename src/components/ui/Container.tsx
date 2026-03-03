interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  as?: React.ElementType;
  maxWidth?: string;
  children: React.ReactNode;
}

export default function Container({
  as: Tag = 'div',
  maxWidth = 'max-w-5xl',
  children,
  className = '',
  ...rest
}: ContainerProps) {
  return (
    <Tag className={`mx-auto ${maxWidth} px-6 ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
