export const courseDefinitions = [
    {
        id: 'ingenieria-de-prompting',
        name: 'Ingeniería de prompting',
        emoji: '🤖',
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
        emoji: '🧩',
        level: 'Nivel intermedio',
        totalLessons: 8,
        lessons: [
            { title: 'Clase 1', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080ba882ed688620d7a19' },
            { title: 'Clase 2', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e90805e9f8ee93340dc78ea' },
            { title: 'Clase 3', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080699c8afbdb762e728d' },
            { title: 'Clase 4', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080468d9ef5ac0634c736' },
            { title: 'Clase 5', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e908045b23eeb0d952be0f5' },
            { title: 'Clase 6', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e90803188d6e8f460015c2a' },
            { title: 'Clase 7', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e90803e8026ee62fa5e7898' },
            { title: 'Clase 8', notionUrl: 'https://fan-utahraptor-cfe.notion.site/ebd/3cc0c69b2e9080b48b2fce5e10fdccf8' }
        ]
    },
    {
        id: 'emprender',
        name: 'Emprender',
        emoji: '💼',
        level: 'Nivel inicial',
        totalLessons: 14,
        lessons: [
            { title: 'Clase 1', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3b02ab7e050880fca06bd3aef9ff1f71' },
            { title: 'Clase 2', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3b12ab7e05088020bf82c9774f486c3c' },
            { title: 'Clase 3', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3b22ab7e0508807e9b9ffa6b086a2bd8' },
            { title: 'Clase 4', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3b42ab7e05088097b2f4c20849713512' },
            { title: 'Clase 5', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3b92ab7e05088022af6eea156d58741d' },
            { title: 'Clase 6', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3b92ab7e0508805dae98d59d687819e3' },
            { title: 'Clase 7', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3ba2ab7e050880e98de7e15133afede0' },
            { title: 'Clase 8', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3ba2ab7e05088007bbe0ed9473306e46' },
            { title: 'Clase 9', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3bb2ab7e050880fc9af1dc70b820dff9' },
            { title: 'Clase 10', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3bb2ab7e0508800d8ca6d4da16193f35' },
            { title: 'Clase 11', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3bb2ab7e05088041b47ce04271521262' },
            { title: 'Clase 12', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3bb2ab7e050880a0bd88f738ca8749ad' },
            { title: 'Clase 13', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3bb2ab7e0508803384d4f84d9ad7582e' },
            { title: 'Clase 14', notionUrl: 'https://chambray-raven-b65.notion.site/ebd/3bd2ab7e050880799559f1c1a43206ac' }
        ]
    },
];

export const availableCourses = courseDefinitions.map(({ lessons, ...course }) => course);
