import { withPlatform } from '../../services/withPlatform';
import Input from './Input@ios.vue';

const component = withPlatform({ ios: Input });

export default component;
