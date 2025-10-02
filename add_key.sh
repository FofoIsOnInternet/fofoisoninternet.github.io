#!/bin/bash

FR_FILE="Langs/fr.json"
EN_FILE="Langs/en.json"
TEMPLATE_FILE="Langs/template.json"

# Vérifie que jq est installé
if ! command -v jq &>/dev/null; then
    echo "❌ jq n'est pas installé. Installe-le avec : sudo apt install jq"
    exit 1
fi

# Codes couleurs ANSI
BLUE="\033[34m"
GREEN="\033[32m"
YELLOW="\033[33m"
RESET="\033[0m"

# Fonction pour trouver le prochain index disponible
get_next_index() {
    local regex=$1
    local file=$2
    local indices=$(jq -r "keys_unsorted[] | select(test(\"$regex\"))" "$file" \
        | grep -oE "[0-9]+$" | sort -n)

    if [ -z "$indices" ]; then
        echo 1
    else
        echo $(( $(echo "$indices" | tail -n1) + 1 ))
    fi
}

# Fonction de recherche texte
search_text() {
    local query=$1
    for FILE in "$FR_FILE" "$EN_FILE" "$TEMPLATE_FILE"; do
        echo -e "🔎 Résultats dans ${BLUE}$FILE${RESET} :"
        jq -r --arg q "$query" '
            to_entries[]
            | select(.value|tostring|test($q;"i"))
            | "\(.key)::::\(.value)"
        ' "$FILE" | while IFS="::::" read -r key val; do
            echo -e " - ${GREEN}$key${RESET} : ${YELLOW}$val${RESET}"
        done
    done
}

# Boucle principale
while true; do
    echo ""
    echo "📌 Que veux-tu faire ?"
    echo " 1) Ajouter une compétence générale (skill-x)"
    echo " 2) Ajouter un titre de projet (project-n-title)"
    echo " 3) Ajouter une description de projet (project-n-description)"
    echo " 4) Ajouter une spécification de projet (project-n-spec-x)"
    echo " 5) Ajouter une compétence de projet (project-n-skill-x)"
    echo " 6) Ajouter une image de projet (project-n-img-x)"
    echo " 7) Ajouter une clé personnalisée"
    echo " 8) Rechercher du texte dans les fichiers"
    echo " q) Quitter"
    read -p "👉 Choix [1-8/q] : " CHOICE

    if [ "$CHOICE" = "q" ]; then
        echo "👋 Fin du script."
        exit 0
    fi

    KEY=""
    case $CHOICE in
        1)
            idx=$(get_next_index '^skill-[0-9]+$' "$FR_FILE")
            KEY="skill-$idx"
            ;;
        2)
            read -p "Numéro du projet : " N
            KEY="project-$N-title"
            ;;
        3)
            read -p "Numéro du projet : " N
            KEY="project-$N-description"
            ;;
        4)
            read -p "Numéro du projet : " N
            idx=$(get_next_index "^project-$N-spec-[0-9]+$" "$FR_FILE")
            KEY="project-$N-spec-$idx"
            ;;
        5)
            read -p "Numéro du projet : " N
            idx=$(get_next_index "^project-$N-skill-[0-9]+$" "$FR_FILE")
            KEY="project-$N-skill-$idx"
            ;;
        6)
            read -p "Numéro du projet : " N
            idx=$(get_next_index "^project-$N-img-[0-9]+$" "$FR_FILE")
            KEY="project-$N-img-$idx"
            ;;
        7)
            read -p "👉 Entre la clé personnalisée : " KEY
            ;;
        8)
            read -p "🔎 Texte à rechercher : " QUERY
            search_text "$QUERY"
            continue
            ;;
        *)
            echo "❌ Choix invalide."
            continue
            ;;
    esac

    echo -e "🔑 Clé générée : ${GREEN}$KEY${RESET}"

    # Vérifie si la clé existe déjà
    if jq -e --arg k "$KEY" '.[$k]' "$FR_FILE" >/dev/null ||
       jq -e --arg k "$KEY" '.[$k]' "$EN_FILE" >/dev/null ||
       jq -e --arg k "$KEY" '.[$k]' "$TEMPLATE_FILE" >/dev/null; then
        echo -e "⚠️ La clé ${GREEN}'$KEY'${RESET} existe déjà."
        continue
    fi

    # Demande les traductions
    read -p "🇫🇷 Texte en français : " FR_VALUE
    read -p "🇬🇧 Texte en anglais : " EN_VALUE

    # Mise à jour des fichiers
    tmp_fr=$(mktemp)
    tmp_en=$(mktemp)
    tmp_tpl=$(mktemp)

    jq --arg k "$KEY" --arg v "$FR_VALUE" '. + {($k): $v}' "$FR_FILE" > "$tmp_fr" && mv "$tmp_fr" "$FR_FILE"
    jq --arg k "$KEY" --arg v "$EN_VALUE" '. + {($k): $v}' "$EN_FILE" > "$tmp_en" && mv "$tmp_en" "$EN_FILE"
    jq --arg k "$KEY" '. + {($k): ""}' "$TEMPLATE_FILE" > "$tmp_tpl" && mv "$tmp_tpl" "$TEMPLATE_FILE"

    echo -e "✅ Ajouté : ${GREEN}$KEY${RESET}"
done
