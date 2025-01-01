import { useState } from 'react';
import { cn } from '@nextui-org/react';

const SampleSplitter = ({ id = 'drag-bar', dir, isDragging, classNames, ...props }) => {
    const [isFocused, setIsFocused] = useState(false)

    return (
        <div
            id={id}
            data-testid={id}
            tabIndex={0}
            className={cn(
                'sample-drag-bar',
                dir === 'horizontal' && 'sample-drag-bar--horizontal',
                (isDragging || isFocused) && 'sample-drag-bar--dragging',
                classNames
            )}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
        />
    )
}

export default SampleSplitter
