export module wj.angular2 {
    'use strict';
    export class MetaFactory extends wijmo.interop.ControlMetaFactory {
        // Override to return wijmo.knockout.PropDesc
        public static CreateProp(propertyName: string, propertyType: wijmo.interop.PropertyType,
            changeEvent?: string, enumType?,
            isNativeControlProperty?: boolean, priority?: number): PropDesc {

            return new PropDesc(propertyName, propertyType, changeEvent, enumType, isNativeControlProperty, priority);
        }

        // Override to return wijmo.knockout.EventDesc
        public static CreateEvent(eventName: string, isPropChanged?: boolean): EventDesc {
            return new EventDesc(eventName, isPropChanged);
        }

        // Override to return wijmo.knockout.ComplexPropDesc
        public static CreateComplexProp(propertyName: string, isArray: boolean, ownsObject?: boolean): ComplexPropDesc {
            return new ComplexPropDesc(propertyName, isArray, ownsObject);
        }

        // Typecasted override.
        public static findProp(propName: string, props: PropDesc[]): PropDesc {
            return <PropDesc>wijmo.interop.ControlMetaFactory.findProp(propName, props);
        }

        // Typecasted override.
        public static findEvent(eventName: string, events: EventDesc[]): EventDesc {
            return <EventDesc>wijmo.interop.ControlMetaFactory.findEvent(eventName, events);
        }

        // Typecasted override.
        public static findComplexProp(propName: string, props: ComplexPropDesc[]): ComplexPropDesc {
            return <ComplexPropDesc>wijmo.interop.ControlMetaFactory.findComplexProp(propName, props);
        }

    }

    export class PropDesc extends wijmo.interop.PropDescBase {
    }

    // Describes a scope event
    export class EventDesc extends wijmo.interop.EventDescBase {
    }

    // Describe property info for nested directives.
    export class ComplexPropDesc extends wijmo.interop.ComplexPropDescBase {
    }
}

export var wjNg2Meta = wj.angular2;
export type ComplexPropDesc = wj.angular2.ComplexPropDesc;
