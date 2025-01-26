# Top level comments
# These should fold together
# As a block

# Separate block
# With some distance


def example():
    # Indented comments
    # Should fold together
    # Even with indentation
    print("hello")

    code = True
    # Mid-function comments
    # Should also fold
    more_code = False

    if code:
        # Deeply nested comments
        # Should fold at this level
        pass


# Comments with different indentation
# Some extra space before this one
# And even more here
# Back to normal
# Should these fold together or separate?


def another_example():
    # Comment block 1
    # With multiple lines

    # Comment block 2
    # Separated by blank line
    # Should it be separate?

    print("test")  # Inline comment
    print("more")  # Another inline
    print("code")  # Should these fold?


"""
Multi line docstring
Not a target for our folding
"""


# Comments next to complex structures
class TestClass:
    # Class level comments
    # Should fold

    def __init__(self):
        # Method comments
        # Should fold too
        pass


# Comments with special characters
# TODO: Something important
# FIXME: This is broken
# NOTE: Remember this
# Should these fold together?

#No space after hash
#These are valid too
#Should fold despite style

# Comments with varying content length
# This is a really long comment that extends beyond the usual length of a line and might even wrap depending on your editor settings
# Short one
# Another really long comment that keeps going and going and might also wrap around depending on your settings
# Does folding handle these properly?
