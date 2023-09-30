import { withPlatform } from '../../services/withPlatform';
import Textarea from './Textarea@ios.vue';

const component = withPlatform({ ios: Textarea });

export default component;
