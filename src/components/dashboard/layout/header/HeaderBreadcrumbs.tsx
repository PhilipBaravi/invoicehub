import { FC, Fragment } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const HeaderBreadcrumbs: FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Home or InvoiceHub */}
        <BreadcrumbItem>
          <Link to="/" className="breadcrumb-link-class">
            InvoiceHub
          </Link>
        </BreadcrumbItem>
        {pathnames.length > 0 && <BreadcrumbSeparator />} {/* Separator after InvoiceHub */}

        {/* If the path has more than 2 segments, display a dropdown */}
        {pathnames.length > 2 && (
          <>
            <BreadcrumbItem>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1">
                  <BreadcrumbEllipsis className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {pathnames.slice(0, -2).map((name, index) => (
                    <DropdownMenuItem key={name || index}>
                      <Link to={`/${pathnames.slice(0, index + 1).join("/")}`}>
                        {name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </>
        )}

        {/* Middle Segment */}
        {pathnames.slice(-2, -1).map((name, index) => (
          <Fragment key={name || index}>
            <BreadcrumbItem>
              <Link
                to={`/${pathnames.slice(0, pathnames.length - 1).join("/")}`}
                className="breadcrumb-link-class"
              >
                {name}
              </Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}

        {/* Last Segment (Current Page) */}
        <BreadcrumbItem>
          <BreadcrumbPage>{pathnames[pathnames.length - 1]}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default HeaderBreadcrumbs;
