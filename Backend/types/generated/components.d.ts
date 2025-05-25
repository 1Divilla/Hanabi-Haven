import type { Schema, Struct } from '@strapi/strapi';

export interface HistoryRegisterHistoryRegister extends Struct.ComponentSchema {
  collectionName: 'components_history_register_history_registers';
  info: {
    displayName: 'historyRegister';
  };
  attributes: {
    chapter: Schema.Attribute.Relation<'oneToOne', 'api::chapter.chapter'>;
    date: Schema.Attribute.DateTime;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'history-register.history-register': HistoryRegisterHistoryRegister;
    }
  }
}
