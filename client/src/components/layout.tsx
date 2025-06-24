import { Outlet } from "react-router-dom";
import LinkNavigator from "./link-navigator";

export default function Layout() {
  return (
    <div>
      <nav className="z-50 -mt-15 flex justify-center gap-5 fixed w-full">
        <LinkNavigator link="/control-panel" name="CONTROL PANEL" />
        <LinkNavigator link="/configurations" name="CONFIGURATIONS" />
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
