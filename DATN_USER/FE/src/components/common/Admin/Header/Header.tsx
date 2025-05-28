import DropdownMessage from "./DropdownMessage";
import DropdownNotification from "./DropdownNotification";
import DropdownUser from "./DropdownUser";

const Header = () => {
  return (
    <div>
      {" "}
      <header className="sticky top-0 z-999 flex w-full justify-end bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
        <div className="flex  items-center mx-9  px-4 py-4 shadow-2 md:px-6 2xl:px-11">
          <div className="flex  items-center gap-5 2xsm:gap-7">
            <ul className="flex items-center gap-5 2xsm:gap-4">
              <DropdownNotification />
              {/* <DropdownMessage /> */}
            </ul>

            <DropdownUser />
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
