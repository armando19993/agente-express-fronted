import React from 'react'

const HeaderLayout = ({ title, actions }) => {
    return (
        <div className="sm:flex sm:justify-between sm:items-center mb-8">

            {/* Left: Title */}
            <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl md:text-3xl text-gray-800 dark:text-gray-100 font-bold">{title}</h1>
            </div>

            {/* Right: Actions */}
            <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
                {actions}
            </div>

        </div>
    )
}

export default HeaderLayout