import React from 'react';

// Regular comments before JSX
// Should fold normally
function Component() {
    // Comments in JS context
    // Should fold
    return (
        <div>
            {/* Need to decide about these 
             JSX multi-line comments */}
            <span>text</span>
            
            {
                // Comments in embedded JS
                // Should fold
                doSomething()
            }
        </div>
    );
}