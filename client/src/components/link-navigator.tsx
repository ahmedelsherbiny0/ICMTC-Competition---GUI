import { Link, useLocation } from "react-router-dom";

export default function LinkNavigator({
  link,
  name,
}: {
  link: string;
  name: string;
}) {
  const { pathname } = useLocation();

  return (
    <Link
      to={link}
      className={`py-1 px-5 rounded-2xl ${
        pathname === link ? "bg-active" : "bg-component-background"
      }`}
    >
      {name}
    </Link>
  );
}
