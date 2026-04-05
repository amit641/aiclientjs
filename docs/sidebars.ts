import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docsSidebar: [
    'intro',
    'getting-started',
    {
      type: 'category',
      label: 'Guides',
      items: [
        'guides/streaming',
        'guides/structured-output',
        'guides/tool-calling',
        'guides/providers',
        'guides/error-handling',
      ],
    },
    'api-reference',
  ],
};

export default sidebars;
