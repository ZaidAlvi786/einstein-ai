import { NavLink, useLocation } from 'react-router-dom';
import React from 'react';
import { clsx } from 'clsx';
import { ChevronRightIcon, Home02Icon } from '@assets/iconComponents';


interface CustomBreadcrumbsProps {
  lastText?: string | null;
}

function kebabCaseToText(input: string) {
  const words = input.split('-');
  const firstWordCapitalized = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  const formattedString = [firstWordCapitalized, ...words.slice(1)].join(' ');
  
  return formattedString;
}

export function CustomBreadcrumbs({lastText}: CustomBreadcrumbsProps) {
  const { pathname } = useLocation();
  const segments = pathname.split('/');

  const breadcrumbItems = segments.map((segment, index) => {
    const url = segments.slice(0, index + 1).join('/');

    if (index === 0) {
      return (
        <NavLink to="/" key={index} end className="p-1">
          <Home02Icon className="align-middle size-5 text-gray-500" />
        </NavLink>
      );
    }

    if (lastText && (segments.length -1 == index)) {

      return (
        <React.Fragment key={index}>
          <ChevronRightIcon className="text-gray-300 size-4" />
          <NavLink
            to={url}
            key={index}
            end
            className={({ isActive }) =>
              clsx(
                'text-gray-700 text-sm-semibold flex content-center items-center bg-gray-100 rounded-md py-1 px-8' ,
                'p-1 text-sm-medium	'
              )
            }
          >
            {lastText}
          </NavLink>
        </React.Fragment>
      );


    }
    return (
      <React.Fragment key={index}>
        <ChevronRightIcon className="text-gray-300 size-4" />
        <NavLink
          to={url}
          key={index}
          end
          className={({ isActive }) =>
            clsx(
              isActive ? 'text-gray-700 text-sm-semibold flex content-center items-center bg-gray-100 rounded-md py-1 px-8' : 'text-gray-600',
              'p-1 text-sm-medium	'
            )
          }
        >
          {kebabCaseToText(segment)}
        </NavLink>
      </React.Fragment>
    );
  });

  return (
    <div className=" flex items-center gap-2 text-sm-medium text-gray-500">
      {breadcrumbItems}
    </div>
  );
}
