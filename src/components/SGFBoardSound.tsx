import { GameActionState } from "models/Game";

import * as placeStoneSound from 'assets/audio/placestone.mp3';
import * as invalidMoveSound from 'assets/audio/invalidmove.mp3';
import * as removeStoneSound from 'assets/audio/removestone.mp3';
import useSound from "components/hook/sound";

const SGFBoardSound = (actionState: GameActionState): void => {
    useSound(placeStoneSound.default, actionState, GameActionState.SUCCESS);
    useSound(invalidMoveSound.default, actionState, GameActionState.FAIL);
    useSound(removeStoneSound.default, actionState, GameActionState.SUCCESS_REMOVE_STONE);
};
export default SGFBoardSound;