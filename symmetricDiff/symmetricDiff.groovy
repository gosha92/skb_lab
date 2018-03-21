import java.util.stream.Collectors

Set symmetricDiff(List list1, List list2) {
    Set set1 = list1 as Set
    Set set2 = list2 as Set
    set1 + set2 - set1.intersect(set2)
}

String symmetricDiffAsString(List list1, List list2) {
    unique(list1, list2).join(",")
}

assert symmetricDiff(
        [1, 2, 3, 4, 5, 6, 7, 8, 9],
        [1, 3, 5, 7, 9, 11, 13, 15]
).equals([2, 4, 6, 8, 11, 13, 15] as Set)

assert symmetricDiff(
        [],
        []
).equals([] as Set)

assert symmetricDiff(
        [1, 2, 3],
        [1, 2, 3]
).equals([] as Set)

assert symmetricDiff(
        [1, 2, 3],
        []
).equals([1, 2, 3] as Set)

assert symmetricDiff(
        [],
        [1, 2, 3]
).equals([1, 2, 3] as Set)

assert symmetricDiff(
        [0, 2, 3, 4, 5],
        [1, 2, 3, 4, 5, 1]
).equals([0, 1] as Set)

assert symmetricDiff(
        [1, 2, 3, 4, 5, 1],
        [0, 2, 3, 4, 5]
).equals([0, 1] as Set)
