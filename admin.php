<?php
// Protection contre les erreurs
error_reporting(E_ALL);
ini_set('display_errors', 1);

$csvFile = 'instructions.csv';
$message = '';

// Fonction pour lire le CSV
function readCSV($file) {
    $data = [];
    if (($handle = fopen($file, "r")) !== FALSE) {
        // Ignorer l'en-tête
        $header = fgetcsv($handle);
        while (($row = fgetcsv($handle)) !== FALSE) {
            if (count($row) >= 2) {
                $data[] = ['lettre' => $row[0], 'instruction' => $row[1]];
            }
        }
        fclose($handle);
    }
    return $data;
}

// Fonction pour sauvegarder le CSV
function saveCSV($file, $data) {
    if (($handle = fopen($file, "w")) !== FALSE) {
        // Écrire l'en-tête
        fputcsv($handle, ['lettre', 'instruction']);
        // Écrire les données
        foreach ($data as $row) {
            fputcsv($handle, [$row['lettre'], $row['instruction']]);
        }
        fclose($handle);
        return true;
    }
    return false;
}

// Traitement des actions
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['action'])) {
        $data = readCSV($csvFile);
        
        switch ($_POST['action']) {
            case 'add':
                if (!empty($_POST['lettre']) && !empty($_POST['instruction'])) {
                    $data[] = [
                        'lettre' => strtoupper($_POST['lettre']),
                        'instruction' => $_POST['instruction']
                    ];
                    if (saveCSV($csvFile, $data)) {
                        $message = "Instruction ajoutée avec succès.";
                    }
                }
                break;
                
            case 'update':
                if (isset($_POST['index']) && isset($_POST['lettre']) && isset($_POST['instruction'])) {
                    $index = (int)$_POST['index'];
                    if (isset($data[$index])) {
                        $data[$index] = [
                            'lettre' => strtoupper($_POST['lettre']),
                            'instruction' => $_POST['instruction']
                        ];
                        if (saveCSV($csvFile, $data)) {
                            $message = "Instruction mise à jour avec succès.";
                        }
                    }
                }
                break;
                
            case 'delete':
                if (isset($_POST['index'])) {
                    $index = (int)$_POST['index'];
                    if (isset($data[$index])) {
                        array_splice($data, $index, 1);
                        if (saveCSV($csvFile, $data)) {
                            $message = "Instruction supprimée avec succès.";
                        }
                    }
                }
                break;
        }
    }
}

// Lire les données actuelles
$data = readCSV($csvFile);
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Administration des Instructions</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .message {
            padding: 10px;
            margin: 10px 0;
            background-color: #4CAF50;
            color: white;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: left;
        }
        th {
            background-color: #f5f5f5;
        }
        .actions {
            display: flex;
            gap: 10px;
        }
        button, .button {
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background-color: #4CAF50;
            color: white;
        }
        .delete {
            background-color: #f44336;
        }
        .edit {
            background-color: #2196F3;
        }
        form {
            margin: 20px 0;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        .form-group {
            margin: 10px 0;
        }
        label {
            display: block;
            margin-bottom: 5px;
        }
        input[type="text"] {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .edit-form {
            display: none;
        }
        .edit-form.active {
            display: block;
        }
    </style>
</head>
<body>
    <h1>Administration des Instructions</h1>
    
    <?php if ($message): ?>
        <div class="message"><?php echo htmlspecialchars($message); ?></div>
    <?php endif; ?>

    <!-- Formulaire d'ajout -->
    <form method="post" class="add-form">
        <h2>Ajouter une instruction</h2>
        <input type="hidden" name="action" value="add">
        <div class="form-group">
            <label for="lettre">Lettre :</label>
            <input type="text" id="lettre" name="lettre" maxlength="1" required>
        </div>
        <div class="form-group">
            <label for="instruction">Instruction :</label>
            <input type="text" id="instruction" name="instruction" required>
        </div>
        <button type="submit">Ajouter</button>
    </form>

    <!-- Tableau des instructions -->
    <table>
        <thead>
            <tr>
                <th>Lettre</th>
                <th>Instruction</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($data as $index => $row): ?>
                <tr>
                    <td><?php echo htmlspecialchars($row['lettre']); ?></td>
                    <td><?php echo htmlspecialchars($row['instruction']); ?></td>
                    <td class="actions">
                        <button class="edit" onclick="showEditForm(<?php echo $index; ?>, '<?php echo htmlspecialchars($row['lettre']); ?>', '<?php echo htmlspecialchars($row['instruction']); ?>')">Modifier</button>
                        <form method="post" style="display: inline;">
                            <input type="hidden" name="action" value="delete">
                            <input type="hidden" name="index" value="<?php echo $index; ?>">
                            <button type="submit" class="delete" onclick="return confirm('Êtes-vous sûr de vouloir supprimer cette instruction ?')">Supprimer</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <!-- Formulaire de modification -->
    <form method="post" id="editForm" class="edit-form">
        <h2>Modifier l'instruction</h2>
        <input type="hidden" name="action" value="update">
        <input type="hidden" name="index" id="editIndex">
        <div class="form-group">
            <label for="editLettre">Lettre :</label>
            <input type="text" id="editLettre" name="lettre" maxlength="1" required>
        </div>
        <div class="form-group">
            <label for="editInstruction">Instruction :</label>
            <input type="text" id="editInstruction" name="instruction" required>
        </div>
        <button type="submit">Enregistrer</button>
        <button type="button" onclick="hideEditForm()">Annuler</button>
    </form>

    <script>
        function showEditForm(index, lettre, instruction) {
            document.getElementById('editForm').classList.add('active');
            document.getElementById('editIndex').value = index;
            document.getElementById('editLettre').value = lettre;
            document.getElementById('editInstruction').value = instruction;
            window.scrollTo(0, document.getElementById('editForm').offsetTop);
        }

        function hideEditForm() {
            document.getElementById('editForm').classList.remove('active');
        }
    </script>
</body>
</html>
