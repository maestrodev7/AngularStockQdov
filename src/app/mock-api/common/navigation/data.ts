/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    },
    {
        id   : 'categories',
        title: 'categories',
        type : 'basic',
        icon : 'heroicons_outline:tag',
        link : '/categories'
    },
    {
        id   : 'fournisseurs',
        title: 'fournisseurs',
        type : 'basic',
        icon : 'heroicons_outline:users',
        link : '/fournisseurs'
    },
    {
        id   : 'clients',
        title: 'clients',
        type : 'basic',
        icon : 'heroicons_outline:user-group',
        link : '/clients'
    },
    {
        id   : 'magazins',
        title: 'magazins',
        type : 'basic',
        icon : 'heroicons_outline:building-storefront',
        link : '/magazins'
    },
    {
        id   : 'boutiques',
        title: 'boutiques',
        type : 'basic',
        icon : 'heroicons_outline:shopping-bag',
        link : '/boutiques'
    }
    ,
    {
        id   : 'produits',
        title: 'produits',
        type : 'basic',
        icon : 'heroicons_outline:cube',
        link : '/produits'
    },
    {
        id: 'oprations',
        title: 'Operations',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [
            {
                id: 'oprations.achats',
                title: 'Achats',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/operations/achats',
            },
            {
                id: 'oprations.ventes',
                title: 'Ventes',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/operations/ventes',
            },
            {
                id: 'oprations.transferts',
                title: 'Transferts',
                type: 'basic',
                icon: 'heroicons_outline:clipboard-document-check',
                link: '/operations/transferts',
            }
        ],
    },
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
