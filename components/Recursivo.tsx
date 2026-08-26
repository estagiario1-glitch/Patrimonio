import { Menu } from "@headlessui/react";
import { AiOutlineCaretDown } from "react-icons/ai";

interface DropdownItem {
  name: string;
  path?: string;
  dropdown?: DropdownItem[];
}

interface RecursiveDropdownProps {
  items: DropdownItem[];
}

const RecursiveDropdown = ({ items }: RecursiveDropdownProps) => {
  return (
    <>
      {items.map((item, index) => {
        if (item.dropdown) {
          return (
            <Menu
              as="div"
              key={index}
              className="relative group"
            >
              <Menu.Button
                className="w-full flex items-center justify-between gap-4 px-4 py-1 text-gray-900 whitespace-nowrap hover:bg-gray-100"
              >
                <span>{item.name}</span>

                <AiOutlineCaretDown className="rotate-[-90deg]" />
              </Menu.Button>

              <Menu.Items
                className="
                  absolute
                  left-full
                  top-0
                  min-w-[200px]
                  bg-white
                  rounded-lg
                  shadow-xl
                  overflow-hidden
                  z-[120]
                "
              >
                <RecursiveDropdown items={item.dropdown} />
              </Menu.Items>
            </Menu>
          );
        }

        return (
          <Menu.Item key={index}>
            {({ active }) => (
              <a
                href={item.path}
                className={`block px-4 py-1 text-gray-900 whitespace-nowrap border-b border-gray-50 last:border-0 ${
                  active ? "bg-gray-100" : "bg-white"
                }`}
              >
                {item.name}
              </a>
            )}
          </Menu.Item>
        );
      })}
    </>
  );
};

export default RecursiveDropdown;