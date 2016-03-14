declare module wijmo {
    module interop {
        class ControlMetaFactory {
            static CreateProp(propertyName: string, propertyType: PropertyType, changeEvent?: string, enumType?: any, isNativeControlProperty?: boolean, priority?: number): PropDescBase;
            static CreateEvent(eventName: string, isPropChanged?: boolean): EventDescBase;
            static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDescBase;
            static findProp(propName: string, props: PropDescBase[]): PropDescBase;
            static findEvent(eventName: string, events: EventDescBase[]): EventDescBase;
            static findComplexProp(propName: string, props: ComplexPropDescBase[]): ComplexPropDescBase;
            static getMetaData(metaDataId: any): MetaDataBase;
            static getClassName(classRef: any): string;
            static toCamelCase(s: any): any;
            private static findInArr(arr, propName, value);
        }
        class PropDescBase {
            private _propertyName;
            private _propertyType;
            private _changeEvent;
            private _enumType;
            private _isNativeControlProperty;
            private _priority;
            constructor(propertyName: string, propertyType: PropertyType, changeEvent?: string, enumType?: any, isNativeControlProperty?: boolean, priority?: number);
            public propertyName : string;
            public propertyType : PropertyType;
            public changeEvent : string;
            public enumType : any;
            public bindingMode : BindingMode;
            public isNativeControlProperty : boolean;
            public priority : number;
            public shouldUpdateSource : boolean;
            public initialize(options: any): void;
            public castValueToType(value: any): any;
            private _parseDate(value);
        }
        enum PropertyType {
            Boolean = 0,
            Number = 1,
            Date = 2,
            String = 3,
            AnyPrimitive = 4,
            Enum = 5,
            Function = 6,
            EventHandler = 7,
            Any = 8,
        }
        function isSimpleType(type: PropertyType): boolean;
        enum BindingMode {
            OneWay = 0,
            TwoWay = 1,
        }
        class EventDescBase {
            private _eventName;
            private _isPropChanged;
            constructor(eventName: string, isPropChanged?: boolean);
            public eventName : string;
            public isPropChanged : boolean;
        }
        class ComplexPropDescBase {
            public propertyName: string;
            public isArray: boolean;
            private _ownsObject;
            constructor(propertyName: string, isArray: boolean, ownsObject?: boolean);
            public ownsObject : boolean;
        }
        class MetaDataBase {
            private _props;
            private _events;
            private _complexProps;
            public parentProperty: string;
            public isParentPropertyArray: boolean;
            public ownsObject: boolean;
            public parentReferenceProperty: string;
            public ngModelProperty: string;
            constructor(props: PropDescBase[], events?: EventDescBase[], complexProps?: ComplexPropDescBase[], parentProperty?: string, isParentPropertyArray?: boolean, ownsObject?: boolean, parentReferenceProperty?: string, ngModelProperty?: string);
            public props : PropDescBase[];
            public events : EventDescBase[];
            public complexProps : ComplexPropDescBase[];
            public add(props: PropDescBase[], events?: EventDescBase[], complexProps?: ComplexPropDescBase[], parentProperty?: string, isParentPropertyArray?: boolean, ownsObject?: boolean, parentReferenceProperty?: string, ngModelProperty?: string): MetaDataBase;
            public addOptions(options: any): MetaDataBase;
            public prepare(): void;
        }
    }
}
