import { useBehaviorStore } from "../../shared/store/behaviorStore";
import { useCharacterStore } from "../../shared/store/characterStore";


export function BehaviorPage() {
    const { autonomousEnabled, setAutonomousEnabled } = useBehaviorStore();
    const { characters,  } = useCharacterStore();
    const char = characters['bubu'];

    if (!char) return <div>No character selected</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>Autonomous Life</h2>
            <label>
                <input type="checkbox" checked={autonomousEnabled} onChange={e => setAutonomousEnabled(e.target.checked)} />
                Enable Autonomous Mode
            </label>
        </div>
    );
}
