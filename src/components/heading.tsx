interface HeadingProps {
  text: string | React.ReactNode
}

const Heading = ({ text }: HeadingProps) => (
  <h1 className="font-bold text-xl">{text}</h1>
)

export default Heading
