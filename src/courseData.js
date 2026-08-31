export const courseDefinitions = [
    {
        id: 'ingenieria-de-prompting',
        name: 'Ingeniería de prompting',
        level: 'Nivel inicial',
        totalLessons: 4,
        lessons: [
            { title: 'Clase 1', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3c50c69b2e9080d69f5eeb9d323c860a' },
            { title: 'Clase 2', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3c50c69b2e9080e4b936e59887abf1fe' },
            { title: 'Clase 3', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3c50c69b2e90802d9d04f361509e08c8' },
            { title: 'Clase 4', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3c50c69b2e9080979df0c5fc7f94608c' }
        ]
    },
    {
        id: 'armado-cubo',
        name: 'Armado Cubo Rubik',
        level: 'Nivel intermedio',
        totalLessons: 8,
        lessons: [
            { title: 'Clase 1', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080ba882ed688620d7a19' },
            { title: 'Clase 2', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e90805e9f8ee93340dc78ea' },
            { title: 'Clase 3', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080699c8afbdb762e728d' },
            { title: 'Clase 4', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080b79c5ea4cbe1d0d037' },
            { title: 'Clase 5', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080d1a3cc0b98267ef8f1' },
            { title: 'Clase 6', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080de83ec5f6d7d311f66' },
            { title: 'Clase 7', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e90808e84d8c82ef8b4ee5c' },
            { title: 'Clase 8', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e90805891f883d75ea5d7ea' }
        ]
    }
];

export const availableCourses = courseDefinitions.map(({ lessons, ...course }) => course);
