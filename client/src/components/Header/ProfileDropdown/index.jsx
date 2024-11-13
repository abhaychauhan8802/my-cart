import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Link,
} from "@nextui-org/react";
import { CircleUserRound } from "lucide-react";
import { useUserStore } from "../../../store/useUserStore";

const ProfileDropdown = () => {
  const { user, logout } = useUserStore();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" radius="full">
          <CircleUserRound className="w-5 text-gray-700" />
          <span>Profile</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="profile">
        <DropdownSection showDivider>
          {user ? (
            <DropdownItem
              isReadOnly
              key="mcart"
              textValue="Welcome"
              className="cursor-default"
            >
              <h2 className="text-md font-bold text-gray-800">
                Welcome {user?.username}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
            </DropdownItem>
          ) : (
            <DropdownItem
              isReadOnly
              key="mcart"
              textValue="Welcome"
              className="cursor-default"
            >
              <h2 className="text-md font-bold text-gray-800">
                Welcome to mcart
              </h2>
              <p className="text-gray-600">
                To access account and manage orders
              </p>
              <Button className="mt-3" size="sm" color="primary">
                <Link href="/login" className="text-white text-sm">
                  Login
                </Link>
              </Button>
            </DropdownItem>
          )}
        </DropdownSection>
        {user?.isAdmin && (
          <DropdownSection showDivider>
            <DropdownItem
              as={Link}
              href="/admin-dashboard?tab=products"
              className="text-gray-800 text-sm"
            >
              Admin Dashboard
            </DropdownItem>
          </DropdownSection>
        )}
        <DropdownSection {...(user ? { showDivider: true } : {})}>
          <DropdownItem
            key="orders"
            as={Link}
            href="/orders"
            className="text-gray-800 text-sm"
          >
            Orders
          </DropdownItem>
          <DropdownItem
            key="wishlist"
            href="/wishlist"
            className="text-gray-800 text-sm"
          >
            Wishlist
          </DropdownItem>
        </DropdownSection>
        {user && (
          <DropdownSection>
            <DropdownItem
              key="Edit Profile"
              href="/edit-profile"
              className="text-gray-800 text-sm"
            >
              Edit Profile
            </DropdownItem>
            <DropdownItem
              key="Logout"
              color="danger"
              className="text-danger"
              onClick={logout}
            >
              Logout
            </DropdownItem>
          </DropdownSection>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default ProfileDropdown;
