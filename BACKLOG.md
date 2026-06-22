## robot-gardener-game

- [x] the plants are displayed fully grown as soon as they are planted. the states should go from seed, watered seed, seedling, harvestable plant
- [x] i can scroll on the code editor only using arrow keys. i cant scroll using mouse and the scroll bar is not visible in the code editor
- [x] lets remove the "robot-gardener" module (the one with challenges) AKA keep "robot-gardener-game" and remove "robot-gardener"
- [x] why is the following code not valid?

    ```python
    def update_block():
        block = check_block()
        if block == "stone":
            use_pickaxe()
        elif block == "branch":
            use_axe()
        elif block == "ready":
            harvest()

        block = check_block()
        if block == "empty":
            plant("wheat")
            water()
    ```

    ```python
    reset_bot()

    sx, sy = get_farm_size()
    flag = 1

    for i in range(sx-1):
        for j in range(sy-1):
            update_block()
            move_forward()

        if flag == 1:
            turn_right()
            update_block()
            move_forward()
            turn_right()
            flag = 0
        else:
            turn_left()
            update_block()
            move_forward()
            turn_left()
            flag = 1
    ```

> The code in the python editor was invalid because Python relies on strict indentation, and the initial code had missing indentation in the `update_block` function, the `for` loops, and the `if` statements. Additionally, the line `if flag = 1:` used the assignment operator `=` instead of the equality comparison operator `==`, which caused a SyntaxError resulting in the `[ERROR]: bad input` message.
