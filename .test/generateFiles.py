import random as rand
ineList = [] 
index = 0 
 
wordList = ["staking", "rainy", "sweet", "snake", "swing", "taste", "heavenly", "scribble", "gainful", "pack", "border", "kitty", "hunt", "well", "quill", "wander", "melodic", "polite", "discussion", "collar", "subdued", "abaft", "attend", "gray", "vegetable", "meddle", "waiting", "tidy", "potato", "suck", "kneel", "ear", "questionable", "annoy", "overt", "pan", "wonderful", "gun", "vengeful", "chunky", "selfish", "ruddy", "key", "basin", "recess", "incompetent", "smooth", "white", "laborer", "zippy"]
def getRandomString(n, isHeading=False):
    stringList = []
    
    if isHeading:
        for _ in range(n):
            stringList.append(wordList[rand.randrange(0, len(wordList) - 1)].capitalize())

    else:
        for _ in range(n):
            stringList.append(wordList[rand.randrange(0, len(wordList) - 1)])
    
    return " ".join(stringList)


template = []
with open('test-n.tsx', 'r', encoding="utf8") as f:
    lines = f.readlines()
    for line in lines:
        template.append(line)
    


for index in range(25):
    filteredLines = []

    for line in template:
        if "[[EDIT]]" in line:
            line = line.replace("[[EDIT]]", "_" + str(index))

        if "[[NAME]]" in line:
            line = line.replace("[[NAME]]", getRandomString(3, True))

        if "[[DESCRIPTION]]" in line:
            line = line.replace("[[DESCRIPTION]]", getRandomString(20))

        if "[[CONTENT]]" in line:
            line = line.replace("[[CONTENT]]", getRandomString(3, True))

        if "[[PARAGRAPH]]" in line:
            line = line.replace("[[PARAGRAPH]]", getRandomString(50))

        filteredLines.append(line)

    with open(f"./test_{index}.tsx", "w+") as f:
        for fl in filteredLines:
            f.write(fl)
